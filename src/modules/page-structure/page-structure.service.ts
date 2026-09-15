import prisma from "@/lib/prisma";

// Get all page sections sorted by order
export const getPageSections = async () => {
  return await prisma.pageSection.findMany({
    orderBy: {
      order: 'asc'
    }
  });
};

// Seed initial sections if they don't exist
export const seedInitialSections = async () => {
  const existingCount = await prisma.pageSection.count();
  
  if (existingCount === 0) {
    const initialSections = [
      { sectionId: 'home', title: 'HOME', order: 1, isActive: true },
      { sectionId: 'about', title: 'ABOUT', order: 2, isActive: true },
      { sectionId: 'programs', title: 'PROGRAMS', order: 3, isActive: true },
      { sectionId: 'services', title: 'SERVICES', order: 4, isActive: true },
      { sectionId: 'coaches', title: 'COACHES', order: 5, isActive: true },
      { sectionId: 'transformations', title: 'TRANSFORMATIONS', order: 6, isActive: true },
      { sectionId: 'membership', title: 'MEMBERSHIP', order: 7, isActive: true },
      { sectionId: 'gallery', title: 'GALLERY', order: 8, isActive: true },
      { sectionId: 'contact', title: 'CONTACT', order: 9, isActive: true },
    ];

    await prisma.pageSection.createMany({
      data: initialSections
    });
    
    return await getPageSections();
  }
  
  return null;
};

// Bulk update the entire structure
export const bulkUpdateSections = async (
  sections: { id: string; sectionId: string; title: string; order: number; isActive: boolean }[]
) => {
  // Use a transaction to ensure all updates succeed or fail together
  const updatePromises = sections.map((section) => 
    prisma.pageSection.update({
      where: { id: section.id },
      data: {
        title: section.title,
        order: section.order,
        isActive: section.isActive
      }
    })
  );

  await prisma.$transaction(updatePromises);
  
  return await getPageSections();
};
