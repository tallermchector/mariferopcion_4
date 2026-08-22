// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const INITIAL_CATEGORIES = [
  {
    id: 'cat-vestidos',
    name: 'Vestidos',
    slug: 'vestidos',
    description: 'Diseños fluidos y cortes midi para todos los días.',
    image: 'https://picsum.photos/seed/marifer-cat-vestidos/400/400',
  },
  {
    id: 'cat-blusas',
    name: 'Blusas',
    slug: 'blusas',
    description: 'Siluetas ligeras, detalles sutiles y calces cómodos.',
    image: 'https://picsum.photos/seed/marifer-cat-blusas/400/400',
  },
  {
    id: 'cat-pantalones',
    name: 'Pantalones',
    slug: 'pantalones',
    description: 'Jeanes rectos y sastrería de tiro alto atemporal.',
    image: 'https://picsum.photos/seed/marifer-cat-pantalones/400/400',
  },
  {
    id: 'cat-abrigos',
    name: 'Abrigos',
    slug: 'abrigos',
    description: 'Buzos de punto suave y camperas estructuradas.',
    image: 'https://picsum.photos/seed/marifer-cat-abrigos/400/400',
  },
  {
    id: 'cat-camisas',
    name: 'Camisas',
    slug: 'camisas',
    description: 'Poplín de algodón puro y estructuras relajadas.',
    image: 'https://picsum.photos/seed/marifer-cat-camisas/400/400',
  },
  {
    id: 'cat-polleras',
    name: 'Polleras',
    slug: 'polleras',
    description: 'Faldas midi y cortes al bies con caída limpia.',
    image: 'https://picsum.photos/seed/marifer-cat-polleras/400/400',
  },
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Vestido midi Lucía',
    slug: 'vestido-midi-lucia',
    description: 'Vestido midi confeccionado en lino suave con caída natural. Escote sutil, bolsillos laterales y calce relajado para usar todos los días en Montevideo.',
    price: 1290,
    compareAtPrice: 1890,
    image: 'https://picsum.photos/seed/marifer-dress-lucia/600/800',
    images: JSON.stringify([
      'https://picsum.photos/seed/marifer-dress-lucia/600/800',
      'https://picsum.photos/seed/marifer-dress-lucia-2/600/800',
      'https://picsum.photos/seed/marifer-dress-lucia-3/600/800',
      'https://picsum.photos/seed/marifer-dress-lucia-4/600/800',
    ]),
    rating: 4.9,
    numReviews: 38,
    stock: 15,
    featured: true,
    categoryId: 'cat-vestidos',
  },
  {
    id: 'prod-2',
    name: 'Blusa Ana manga globo',
    slug: 'blusa-ana-manga-globo',
    description: 'Blusa de algodón peinado con mangas ligeramente abullonadas, puños finos y botones al tono. Una prenda liviana y femenina para combinar sin esfuerzo.',
    price: 890,
    compareAtPrice: null,
    image: 'https://picsum.photos/seed/marifer-blouse-ana/600/800',
    images: JSON.stringify([
      'https://picsum.photos/seed/marifer-blouse-ana/600/800',
      'https://picsum.photos/seed/marifer-blouse-ana-2/600/800',
      'https://picsum.photos/seed/marifer-blouse-ana-3/600/800',
    ]),
    rating: 4.8,
    numReviews: 26,
    stock: 12,
    featured: true,
    categoryId: 'cat-blusas',
  },
  {
    id: 'prod-3',
    name: 'Jean recto Malena',
    slug: 'jean-recto-malena',
    description: 'Denim de tiro alto clásico y pierna recta confeccionado con mezcla de algodón noble. Lavado suave y estructura confortable para todos los días.',
    price: 1690,
    compareAtPrice: null,
    image: 'https://picsum.photos/seed/marifer-jean-malena/600/800',
    images: JSON.stringify([
      'https://picsum.photos/seed/marifer-jean-malena/600/800',
      'https://picsum.photos/seed/marifer-jean-malena-2/600/800',
      'https://picsum.photos/seed/marifer-jean-malena-3/600/800',
    ]),
    rating: 5.0,
    numReviews: 44,
    stock: 18,
    featured: true,
    categoryId: 'cat-pantalones',
  },
  {
    id: 'prod-4',
    name: 'Buzo oversize Rambla',
    slug: 'buzo-oversize-rambla',
    description: 'Buzo tejido en punto suave y abrigado con calce amplio, cuello redondo y terminaciones acanaladas. Ideal para tardes frescas y caminatas por la costa.',
    price: 1450,
    compareAtPrice: 1790,
    image: 'https://picsum.photos/seed/marifer-sweater-rambla/600/800',
    images: JSON.stringify([
      'https://picsum.photos/seed/marifer-sweater-rambla/600/800',
      'https://picsum.photos/seed/marifer-sweater-rambla-2/600/800',
      'https://picsum.photos/seed/marifer-sweater-rambla-3/600/800',
    ]),
    rating: 4.9,
    numReviews: 32,
    stock: 10,
    featured: true,
    categoryId: 'cat-abrigos',
  },
  {
    id: 'prod-5',
    name: 'Camisa poplín Clara',
    slug: 'camisa-poplin-clara',
    description: 'Camisa clásica en poplín 100% algodón hilado fino. Cuello estructurado, cartera limpia y bajo suavemente curvo para llevar adentro o suelta.',
    price: 1190,
    compareAtPrice: null,
    image: 'https://picsum.photos/seed/marifer-shirt-clara/600/800',
    images: JSON.stringify([
      'https://picsum.photos/seed/marifer-shirt-clara/600/800',
      'https://picsum.photos/seed/marifer-shirt-clara-2/600/800',
    ]),
    rating: 4.7,
    numReviews: 21,
    stock: 14,
    featured: false,
    categoryId: 'cat-camisas',
  },
  {
    id: 'prod-6',
    name: 'Pollera midi Solís',
    slug: 'pollera-midi-solis',
    description: 'Pollera midi al bies con caída fluida y cintura elastizada oculta. Textura satinada mate que no marca y se adapta tanto a chatas como a botas.',
    price: 1350,
    compareAtPrice: 1650,
    image: 'https://picsum.photos/seed/marifer-skirt-solis/600/800',
    images: JSON.stringify([
      'https://picsum.photos/seed/marifer-skirt-solis/600/800',
      'https://picsum.photos/seed/marifer-skirt-solis-2/600/800',
    ]),
    rating: 4.8,
    numReviews: 19,
    stock: 11,
    featured: false,
    categoryId: 'cat-polleras',
  },
  {
    id: 'prod-7',
    name: 'Pantalón sastrero Centro',
    slug: 'pantalon-sastrero-centro',
    description: 'Pantalón de corte sastre con pinzas dobles y pierna recta holgada. Cintura limpia y tejido con peso noble para oficina o estilismos diarios.',
    price: 1590,
    compareAtPrice: 1990,
    image: 'https://picsum.photos/seed/marifer-pants-centro/600/800',
    images: JSON.stringify([
      'https://picsum.photos/seed/marifer-pants-centro/600/800',
      'https://picsum.photos/seed/marifer-pants-centro-2/600/800',
    ]),
    rating: 4.8,
    numReviews: 29,
    stock: 16,
    featured: false,
    categoryId: 'cat-pantalones',
  },
  {
    id: 'prod-8',
    name: 'Campera paño Pocitos',
    slug: 'campera-pano-pocitos',
    description: 'Campera abrigada en paño suave con solapa ancha, bolsillos diagonales y forrería al tono. Corte moderno y terminaciones cuidadas.',
    price: 2990,
    compareAtPrice: null,
    image: 'https://picsum.photos/seed/marifer-jacket-pocitos/600/800',
    images: JSON.stringify([
      'https://picsum.photos/seed/marifer-jacket-pocitos/600/800',
      'https://picsum.photos/seed/marifer-jacket-pocitos-2/600/800',
    ]),
    rating: 5.0,
    numReviews: 17,
    stock: 8,
    featured: false,
    categoryId: 'cat-abrigos',
  },
  {
    id: 'prod-9',
    name: 'Vestido camisero Parque Rodó',
    slug: 'vestido-camisero-parque-rodo',
    description: 'Vestido camisero en algodón liviano con botonadura de arriba a abajo y lazo opcional en la cintura. Respirable, fresco y atemporal.',
    price: 1490,
    compareAtPrice: null,
    image: 'https://picsum.photos/seed/marifer-dress-rodo/600/800',
    images: JSON.stringify([
      'https://picsum.photos/seed/marifer-dress-rodo/600/800',
      'https://picsum.photos/seed/marifer-dress-rodo-2/600/800',
    ]),
    rating: 4.7,
    numReviews: 22,
    stock: 13,
    featured: false,
    categoryId: 'cat-vestidos',
  },
];

export async function main() {
  console.log('Iniciando seed de datos Marifer...');

  // Limpiar datos existentes
  await prisma.cartItem.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // Crear usuario demo
  const demoUser = await prisma.user.create({
    data: {
      id: 'usr-demo',
      email: 'contacto@marifer.uy',
      name: 'Mariana Silva',
      role: 'USER',
    },
  });

  // Crear categorías
  for (const cat of INITIAL_CATEGORIES) {
    await prisma.category.create({
      data: cat,
    });
  }

  // Crear productos
  for (const prod of INITIAL_PRODUCTS) {
    await prisma.product.create({
      data: prod,
    });
  }

  // Agregar un item al carrito de prueba
  await prisma.cartItem.create({
    data: {
      userId: demoUser.id,
      productId: 'prod-1',
      quantity: 1,
    },
  });

  console.log('Seed Marifer completado con éxito.');
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error('Error durante el seed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}


