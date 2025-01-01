import MenuNav from "@/components/nav-menu";

export default function AudienceListPage() {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <MenuNav props="Audience" />
      </header>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Audience List</h1>
      </div>
    </div>
  );
}
