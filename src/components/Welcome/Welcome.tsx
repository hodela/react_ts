import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type FC } from "react";
import { useTranslation } from "react-i18next";

interface WelcomeProps {
    title?: string;
    subtitle?: string;
}

export const Welcome: FC<WelcomeProps> = ({ title, subtitle }) => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <Card className="animate-fade-in">
                    <CardHeader className="space-y-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full mx-auto flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-primary-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <div>
                            <CardTitle className="text-4xl md:text-5xl mb-4">{title || t("welcome.title")}</CardTitle>
                            <CardDescription className="text-xl">{subtitle || t("welcome.subtitle")}</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="animate-slide-up hover:shadow-lg transition-shadow border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-primary">{t("welcome.features.react.title")}</CardTitle>
                                    <CardDescription>{t("welcome.features.react.description")}</CardDescription>
                                </CardHeader>
                            </Card>

                            <Card
                                className="animate-slide-up hover:shadow-lg transition-shadow border-primary/20"
                                style={{ animationDelay: "0.1s" }}
                            >
                                <CardHeader>
                                    <CardTitle className="text-primary">
                                        {t("welcome.features.typescript.title")}
                                    </CardTitle>
                                    <CardDescription>{t("welcome.features.typescript.description")}</CardDescription>
                                </CardHeader>
                            </Card>

                            <Card
                                className="animate-slide-up hover:shadow-lg transition-shadow border-primary/20"
                                style={{ animationDelay: "0.2s" }}
                            >
                                <CardHeader>
                                    <CardTitle className="text-primary">{t("welcome.features.shadcn.title")}</CardTitle>
                                    <CardDescription>{t("welcome.features.shadcn.description")}</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="animate-fade-in">
                                {t("welcome.buttons.getStarted")}
                            </Button>
                            <Button variant="outline" size="lg" className="animate-fade-in">
                                {t("welcome.buttons.learnMore")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
