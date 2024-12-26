import { motion } from "framer-motion";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { PowerStats } from "@/components/dashboard/PowerStats";
import { Chatbot } from "@/components/Chatbot";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { FileUpload } from "@/components/FileUpload";
import { ApiKeySettings } from "@/components/settings/ApiKeySettings";
import { CompanySidebar } from "@/components/CompanySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Panel Monitorowania</h1>
          <DarkModeToggle />
        </div>
        <ApiKeySettings />
      </div>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <CompanySidebar />
          <main className="flex-1 container px-4 py-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6"
            >
              <Tabs defaultValue="spaces" className="w-full">
                <TabsList>
                  <TabsTrigger value="spaces">Przestrzenie</TabsTrigger>
                  <TabsTrigger value="insights">Analiza</TabsTrigger>
                  <TabsTrigger value="status">Status</TabsTrigger>
                </TabsList>
                
                <TabsContent value="spaces" className="space-y-6">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <PowerStats />
                  </div>

                  <div className="grid gap-4">
                    <EnergyChart />
                  </div>

                  <div className="mt-8 grid gap-8 md:grid-cols-2">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Wgraj plik</h2>
                      <FileUpload />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Asystent AI</h2>
                      <Chatbot />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="insights">
                  <div className="text-center py-12 text-muted-foreground">
                    Sekcja w przygotowaniu
                  </div>
                </TabsContent>

                <TabsContent value="status">
                  <div className="text-center py-12 text-muted-foreground">
                    Sekcja w przygotowaniu
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;