import { KanbanBoard } from "@/components/features/kanban/KanbanBoard";
import { PageHeader, Button } from "@/components/common";
import { LayoutGrid, Plus } from "lucide-react";
import Link from "next/link";

export default function JobsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <PageHeader
        title="Gestão de Vagas"
        subtitle="Acompanhe suas candidaturas no quadro Kanban"
        icon={<LayoutGrid size={32} />}
        actions={
          <Link href="/jobs/new">
            <Button icon={<Plus size={20} />}>
              Nova Vaga
            </Button>
          </Link>
        }
      />

      <KanbanBoard />
    </div>
  );
}
