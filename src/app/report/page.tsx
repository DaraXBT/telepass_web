import MenuNav from "@/components/nav-menu";

export default function ReportPage() {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <MenuNav props="Report" />
      </header>
    </div>
  );
}
