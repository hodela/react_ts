import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, KeyRound, RotateCcw, Mail, CheckCircle, XCircle, Clock } from "lucide-react";
import { generatePageTitle, generateWebsiteSchema } from "@/lib/seo-utils";
import { SEO } from "@/components/shared/SEO";

const AuthDemo = () => {
    const pageTitle = generatePageTitle("Demo Auth Pages");
    const websiteSchema = generateWebsiteSchema();
    const authPages = [
        {
            title: "Đăng nhập",
            description: "Trang đăng nhập với validation và show/hide password",
            path: "/auth/login",
            icon: LogIn,
            color: "text-blue-600",
        },
        {
            title: "Đăng ký",
            description: "Trang đăng ký với checkbox điều khoản",
            path: "/auth/register",
            icon: UserPlus,
            color: "text-green-600",
        },
        {
            title: "Quên mật khẩu",
            description: "Gửi email khôi phục mật khẩu",
            path: "/auth/forgot-password",
            icon: KeyRound,
            color: "text-orange-600",
        },
        {
            title: "Đặt lại mật khẩu",
            description: "Form đặt lại mật khẩu với token validation",
            path: "/auth/reset-password?token=sample-token",
            icon: RotateCcw,
            color: "text-purple-600",
        },
        {
            title: "Xác thực email",
            description: "Trang loading khi xác thực email",
            path: "/auth/verify-email?token=sample-token",
            icon: Mail,
            color: "text-blue-500",
        },
        {
            title: "Xác thực thành công",
            description: "Trang thông báo xác thực email thành công",
            path: "/auth/verify-email-success",
            icon: CheckCircle,
            color: "text-green-500",
        },
        {
            title: "Xác thực thất bại",
            description: "Trang thông báo xác thực email thất bại",
            path: "/auth/verify-email-failed",
            icon: XCircle,
            color: "text-red-500",
        },
        {
            title: "Liên kết hết hạn",
            description: "Trang thông báo liên kết xác thực hết hạn",
            path: "/auth/verify-email-expired",
            icon: Clock,
            color: "text-orange-500",
        },
    ];

    return (
        <>
            <SEO title={pageTitle} description="Demo Auth Pages" keywords="Demo Auth Pages" schema={websiteSchema} />
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Auth Pages Demo</h1>
                        <p className="text-muted-foreground">Tất cả các trang authentication được tạo với shadcn/ui</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {authPages.map((page) => {
                            const IconComponent = page.icon;
                            return (
                                <Card key={page.path} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center space-x-2">
                                            <IconComponent className={`h-6 w-6 ${page.color}`} />
                                            <CardTitle className="text-lg">{page.title}</CardTitle>
                                        </div>
                                        <CardDescription className="text-sm">{page.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <Button asChild className="w-full">
                                            <Link to={page.path}>Xem trang</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="mt-12 text-center">
                        <Card className="max-w-2xl mx-auto">
                            <CardHeader>
                                <CardTitle>Thông tin kỹ thuật</CardTitle>
                            </CardHeader>
                            <CardContent className="text-left space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">🎨 UI Components:</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Sử dụng shadcn/ui components: Card, Button, Input, Label, Alert, Checkbox
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">🔧 Tính năng:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Form validation và error handling</li>
                                        <li>• Show/hide password với icon toggle</li>
                                        <li>• Loading states và disabled states</li>
                                        <li>• Responsive design</li>
                                        <li>• Dark mode support</li>
                                        <li>• Icons từ Lucide React</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">🚀 Sẵn sàng tích hợp:</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Tất cả các trang đã có TODO comments để tích hợp với API backend
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthDemo;
