import React from 'react';
import { getSectionComponent } from '@/lib/cms/section-registry';
import { CMSBlock } from '@/types/cms';
import { prisma } from '@/lib/prisma';

interface BlockRendererProps {
  sections: CMSBlock[];
}

async function resolveSectionData(section: CMSBlock): Promise<CMSBlock> {
  if (section.type === 'people') {
    try {
      const record = await prisma.setting.findUnique({ where: { key: 'people_data' } });
      if (!record) return section;

      const { categories = [], people = [] } = JSON.parse(record.value);
      const selectedMap = (section.data as any)?.selectedPeople;

      const hasSelectedMap = selectedMap && Object.keys(selectedMap).length > 0;

      const resolvedCategories = categories
        .map((cat: any) => {
          const selectedNames = selectedMap?.[cat.id];
          const categoryPeople = people.filter((p: any) => (p.categoryIds || []).includes(cat.id));

          let resolved = categoryPeople;
          if (hasSelectedMap) {
            if (selectedNames && Array.isArray(selectedNames)) {
              resolved = selectedNames
                .map((name: string) => categoryPeople.find((p: any) => p.name === name))
                .filter(Boolean);
            } else {
              resolved = [];
            }
          }

          return {
            id: cat.id,
            label: cat.label,
            people: resolved.filter((p: any) => !p.hidden),
          };
        })
        .filter((cat: any) => cat.people.length > 0);

      return {
        ...section,
        data: {
          ...section.data,
          categories: resolvedCategories,
        },
      };
    } catch (err) {
      console.error('Error resolving people section in BlockRenderer:', err);
      return section;
    }
  }
  return section;
}

export default async function BlockRenderer({ sections }: BlockRendererProps) {
  if (!sections || sections.length === 0) return null;

  const visibleSections = sections.filter((s) => !s.hidden);
  const resolvedSections = await Promise.all(visibleSections.map(resolveSectionData));

  return (
    <>
      {resolvedSections.map((section, idx) => {
        const Component = getSectionComponent(section.type);
        if (!Component) {
          console.warn(`[BlockRenderer] Section type "${section.type}" is not registered.`);
          return null;
        }

        return (
          <React.Fragment key={section.id}>
            {idx > 0 && resolvedSections[idx - 1]?.type !== 'hero' && section.type !== 'hero' && (
              <div className="w-full h-[1px] bg-[var(--border)] opacity-20" />
            )}
            <Component id={section.id} data={section.data} settings={section.settings} />
          </React.Fragment>
        );
      })}
    </>
  );
}
