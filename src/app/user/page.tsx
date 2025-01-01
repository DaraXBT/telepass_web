import MenuNav from "@/components/nav-menu";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {UserList} from "@/components/user/user-list";

export default function UsersPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <MenuNav props="User" />
      </header>
      <Separator />
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users List</h1>
            <p className="text-muted-foreground">
              Manage system users and permissions
            </p>
          </div>
        </div>
        <UserList />
      </div>
    </>
  );
}
