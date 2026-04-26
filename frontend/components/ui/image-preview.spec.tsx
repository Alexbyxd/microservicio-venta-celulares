import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ImagePreview } from './image-preview';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  X: () => <span data-testid="x-icon" />,
  ImageIcon: () => <span data-testid="image-icon" />,
  AlertCircle: () => <span data-testid="alert-icon" />,
  Loader2: () => <span data-testid="loader-icon" />,
}));

describe('ImagePreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería no renderizar nada cuando urls está vacío', () => {
    const { container } = render(<ImagePreview urls="" />);
    expect(container.firstChild).toBeNull();
  });

  it('debería no renderizar nada cuando urls es undefined', () => {
    const { container } = render(<ImagePreview urls={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('debería renderizar estructura cuando hay URLs', () => {
    const urls = 'https://example.com/img1.jpg';
    const { container } = render(<ImagePreview urls={urls} />);
    
    // Should have the flex container
    expect(container.querySelector('.flex')).toBeInTheDocument();
  });

  it('debería renderizar múltiples imágenes', () => {
    const urls = 'https://example.com/img1.jpg, https://example.com/img2.jpg';
    const { container } = render(<ImagePreview urls={urls} />);
    
    // Should have image containers (w-24 h-24)
    const images = container.querySelectorAll('.w-24');
    expect(images.length).toBe(2);
  });

  it('debería manejar URLs con espacios', () => {
    const urls = '  https://example.com/img1.jpg  ,  https://example.com/img2.jpg  ';
    const { container } = render(<ImagePreview urls={urls} />);
    
    // Should have 2 images
    const images = container.querySelectorAll('.w-24');
    expect(images.length).toBe(2);
  });

  it('debería renderizar sin errores para URLs válidas', () => {
    const urls = 'https://example.com/valid-image.jpg';
    const { container } = render(<ImagePreview urls={urls} />);
    
    // Should not throw and should render something
    expect(container.querySelector('.flex')).toBeInTheDocument();
  });

  it('debería tener la clase de contenedor correcta', () => {
    const urls = 'https://example.com/img.jpg';
    const { container } = render(<ImagePreview urls={urls} />);
    
    // Check for correct container class
    const flexContainer = container.querySelector('.flex-wrap');
    expect(flexContainer).toBeInTheDocument();
  });
});
