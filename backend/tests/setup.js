import dotenv from 'dotenv';

// Cargar variables de entorno de test
dotenv.config({ path: '.env.test' });

// Configurar timeout global para tests
jest.setTimeout(10000);

// Mock de console para reducir ruido en tests
global.console = {
  ...console,
  // Mantener error y warn para debugging
  // log: jest.fn(),
  // info: jest.fn(),
  // debug: jest.fn(),
};