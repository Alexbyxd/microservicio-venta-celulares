import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger('RabbitMQService');
  private connection: amqp.ChannelModel;
  private channel: amqp.Channel;
  private readonly queue = 'auth_queue';

  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_HOST || 'amqp://user:pass@localhost:5672');
      this.channel = await this.connection.createChannel();
      
      await this.channel.assertQueue(this.queue, { durable: true });
      
      this.logger.log('Conectado a RabbitMQ');
    } catch (error) {
      this.logger.error('Error al conectar con RabbitMQ:', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async sendMessage(pattern: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.channel) {
        reject(new Error('Canal de RabbitMQ no disponible'));
        return;
      }

      const correlationId = Math.random().toString(36).substring(7);
      
      const message = JSON.stringify(data);

      this.channel.sendToQueue(
        this.queue,
        Buffer.from(message),
        { 
          correlationId, 
          persistent: true,
          headers: { 'pattern': pattern }
        }
      );

      this.channel.consume(
        this.queue,
        (msg) => {
          if (msg && msg.properties.correlationId === correlationId) {
            const response = JSON.parse(msg.content.toString());
            
            if (msg.properties.headers?.['x-error']) {
              reject(new Error(response.message || 'Error en el servicio'));
            } else {
              resolve(response);
            }
            this.channel.ack(msg);
          }
        },
        { noAck: false }
      );

      setTimeout(() => {
        reject(new Error('Tiempo de espera agotado'));
      }, 30000);
    });
  }
}
