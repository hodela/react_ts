import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserMenu } from "@/components/user/UserMenu";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useState } from "react";

export const Header = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const { t } = useTranslation();

    const navigation = [
        { name: t("navigation.home"), path: "/" },
        { name: t("navigation.demoAuth"), path: "/auth-demo" },
        { name: "Components Demo", path: "/components-demo" },
        { name: t("navigation.notFound"), path: "/some-page-that-does-not-exist" },
    ];
    return (
        <header className="bg-card/80 backdrop-blur-sm shadow border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Mobile navigation */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 px-4 flex flex-col">
                            <SheetHeader className="text-left py-4 px-4">
                                <SheetTitle>
                                    <img src="/logo.svg" alt="MyApp" className="w-auto h-6" />
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex-1 flex flex-col space-y-2 overflow-y-auto">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setOpen(false)}
                                        className="text-sm font-medium transition-colors hover:text-primary px-4 py-2 rounded-md hover:bg-accent"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <SheetFooter className="py-4">
                                <div className="flex justify-between w-full">
                                    <ThemeToggle />
                                    <LanguageSelector />
                                </div>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-xl font-bold text-foreground">
                            <img src="/logo.svg" alt="MyApp" className="w-auto h-6" />
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden md:block">
                        <div className="flex space-x-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        location.pathname === item.path
                                            ? "text-primary bg-accent"
                                            : "text-muted-foreground hover:text-primary hover:bg-accent"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex space-x-2">
                            <ThemeToggle showLabel={false} />
                            <LanguageSelector showLabel={false} />
                        </div>
                        <UserMenu />
                    </div>
                </div>
            </div>
        </header>
    );
};
