
import { SpacesHeader } from "@/components/spaces/SpacesHeader";
import { SpacesContent } from "@/components/spaces/SpacesContent";
import { useProjectData } from "@/components/spaces/useProjectData";
import { useSpacesExport } from "@/components/spaces/useSpacesExport";
import { ProjectData } from "@/components/types/ProjectData";

// Re-export ProjectData type for backward compatibility
export type { ProjectData };

export function SpacesTab() {
  const { projectData, generateProjectData } = useProjectData();
  const { spacesRef, handleExport } = useSpacesExport();

  return (
    <div>
      <SpacesHeader 
        onGenerateProject={generateProjectData} 
        onExport={handleExport} 
      />
      <SpacesContent contentRef={spacesRef} />
    </div>
  );
}
