
import { useRef } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { PowerStats } from "@/components/dashboard/PowerStats";
import { AirQualityChart } from "@/components/dashboard/AirQualityChart";
import { DeviceStatus } from "@/components/network/DeviceStatus";
import { FailureAnalysis } from "@/components/network/FailureAnalysis";
import { FileUpload } from "@/components/FileUpload";
import { Chatbot } from "@/components/Chatbot";
import { useTranslation } from 'react-i18next';

interface SpacesContentProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

export function SpacesContent({ contentRef }: SpacesContentProps) {
  const { t } = useTranslation();

  return (
    <div ref={contentRef}>
      <DndContext collisionDetection={closestCenter}>
        <SortableContext items={[]} strategy={rectSortingStrategy}>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <PowerStats />
          </div>
        </SortableContext>
      </DndContext>

      <div className="grid gap-6 p-8">
        <AirQualityChart airQualityData={{}} />
      </div>

      <div className="grid gap-6 p-8">
        <DeviceStatus />
      </div>

      <div className="grid gap-6 p-8">
        <FailureAnalysis />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">{t('Wgraj pliki')}</h2>
          <FileUpload />
        </div>
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">{t('Asystent AI')}</h2>
          <Chatbot />
        </div>
      </div>
    </div>
  );
}
