import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { envs } from './envs';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor() {
    cloudinary.config({
      cloud_name: envs.cloudinary.cloudName,
      api_key: envs.cloudinary.apiKey,
      api_secret: envs.cloudinary.apiSecret,
    });
  }

  isCloudinaryUrl(url: string): boolean {
    if (!url) return false;
    console.log(url);
    return url.includes('res.cloudinary.com') && url.includes('/image/upload');
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (
      !envs.cloudinary.cloudName ||
      !envs.cloudinary.apiKey ||
      !envs.cloudinary.apiSecret
    ) {
      throw new Error('Cloudinary no configurado');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'catalog-products',
          resource_type: 'image',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result.secure_url);
          else reject(new Error('No result from Cloudinary'));
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map((file) =>
      this.uploadFile(file).catch((err) => {
        this.logger.error(
          `Error subiendo archivo ${file.originalname}: ${err.message}`,
        );
        return null;
      }),
    );

    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
  }

  async uploadFromUrl(imageUrl: string): Promise<string> {
    if (this.isCloudinaryUrl(imageUrl)) return imageUrl;

    if (
      !envs.cloudinary.cloudName ||
      !envs.cloudinary.apiKey ||
      !envs.cloudinary.apiSecret
    ) {
      return imageUrl;
    }

    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: 'catalog-products',
        resource_type: 'image',
        use_filename: true,
        unique_filename: true,
      });
      return result.secure_url;
    } catch (error) {
      this.logger.error(
        `Error subiendo imagen desde URL ${imageUrl}: ${error.message}`,
      );
      return imageUrl;
    }
  }

  async processImages(images: string[] | undefined): Promise<string[]> {
    if (!images || images.length === 0) return [];

    const processPromises = images.map((url) => this.uploadFromUrl(url));
    return Promise.all(processPromises);
  }
}
