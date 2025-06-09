import { useAuth } from "@/hooks/useAuth";
import { getAvatarFallback, getAvatarUrl } from "@/lib/imageUtils";
import { ChevronDown, LockIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const UserMenu = () => {
    const { t } = useTranslation();
    const { isAuthenticated, logout, user } = useAuth();
    return isAuthenticated ? (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="flex items-center space-x-2 max-w-40">
                    <Avatar>
                        <AvatarImage src={getAvatarUrl(user?.avatar) || undefined} alt={user?.name} />
                        <AvatarFallback>{getAvatarFallback(user?.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate hidden md:block">{user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link to="/account" className="flex items-center gap-2 w-full">
                        <UserIcon className="w-4 h-4" />
                        {t("account.title")}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/account/change-password" className="flex items-center gap-2 w-full">
                        <LockIcon className="w-4 h-4" />
                        {t("changePassword.title")}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/account/settings" className="flex items-center gap-2 w-full">
                        <SettingsIcon className="w-4 h-4" />
                        {t("settings.title")}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="flex items-center gap-2 cursor-pointer">
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <div className="flex items-center space-x-4">
            <Link
                to="/auth/login"
                className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
            >
                <UserIcon className="w-4 h-4 md:hidden" />
                <span className="hidden md:block">{t("navigation.login")}</span>
            </Link>
            <Link
                to="/auth/register"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors hidden md:block"
            >
                {t("navigation.register")}
            </Link>
        </div>
    );
};
