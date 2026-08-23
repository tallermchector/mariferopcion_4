// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function parseCSV(content: string) {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values: string[] = [];
    let insideQuote = false;
    let current = '';

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    if (values.length >= headers.length) {
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] ?? '';
      });
      rows.push(row);
    }
  }

  return rows;
}

export async function main() {
  console.log('Iniciando seed de datos Marifer desde CSV...');

  const csvPath = path.join(__dirname, 'productos_mapeados_prisma.csv');
  let items: Record<string, string>[] = [];

  if (fs.existsSync(csvPath)) {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    items = parseCSV(csvContent);
    console.log(`Leídos ${items.length} registros desde productos_mapeados_prisma.csv`);
  }

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

  if (items.length > 0) {
    // 1. Extraer categorías del CSV
    const categoryMap = new Map<string, { id: string; name: string; slug: string; image: string }>();

    items.forEach((item) => {
      const catName = item.categoriaNombre || 'General';
      const slug = slugify(catName);
      if (!categoryMap.has(slug)) {
        categoryMap.set(slug, {
          id: `cat-${slug}`,
          name: catName,
          slug: slug,
          image: `https://picsum.photos/seed/marifer-cat-${slug}/400/400`,
        });
      }
    });

    for (const cat of categoryMap.values()) {
      await prisma.category.create({
        data: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          image: cat.image,
          description: `Catálogo de ${cat.name} para todos los días con envío a todo Uruguay.`,
        },
      });
    }

    // 2. Insertar productos del CSV
    const usedSlugs = new Set<string>();
    let inserted = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const catName = item.categoriaNombre || 'General';
      const catSlug = slugify(catName);
      const category = categoryMap.get(catSlug);
      if (!category) continue;

      const baseSlug = slugify(item.nombre || `prenda-${i + 1}`);
      let slug = baseSlug;
      let counter = 1;
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      usedSlugs.add(slug);

      const price = parseFloat(item.precioFinal || item.precioOriginal || '100') || 100;
      const compareAt =
        item.precioOriginal && parseFloat(item.precioOriginal) > price
          ? parseFloat(item.precioOriginal)
          : null;

      const imgSeed = `marifer-prod-${slug}`;
      const mainImg = `https://picsum.photos/seed/${imgSeed}/600/800`;
      const gallery = JSON.stringify([
        mainImg,
        `https://picsum.photos/seed/${imgSeed}-2/600/800`,
        `https://picsum.photos/seed/${imgSeed}-3/600/800`,
      ]);

      await prisma.product.create({
        data: {
          id: `prod-${i + 1}`,
          name: item.nombre || `Prenda ${i + 1}`,
          slug: slug,
          description:
            item.descripcion && item.descripcion.trim().length > 0
              ? item.descripcion
              : `${item.nombre} confeccionado para tu día a día, con materiales nobles y calce cómodo.`,
          price: price,
          compareAtPrice: compareAt,
          image: mainImg,
          images: gallery,
          rating: +(4.6 + (i % 5) * 0.1).toFixed(1),
          numReviews: 8 + (i % 35),
          stock: 5 + (i % 25),
          featured: i < 8, // Destacar los primeros 8
          categoryId: category.id,
        },
      });
      inserted++;
    }

    // Agregar primer producto al carrito de prueba
    await prisma.cartItem.create({
      data: {
        userId: demoUser.id,
        productId: 'prod-1',
        quantity: 1,
      },
    });

    console.log(`Se sembraron ${inserted} productos y ${categoryMap.size} categorías desde el CSV.`);
  }

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



