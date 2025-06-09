import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

export const ComponentsDemo: FC = () => {
    const [switchValue, setSwitchValue] = useState(false);
    const [checkboxValue, setCheckboxValue] = useState(false);
    const [sliderValue, setSliderValue] = useState([50]);
    const [progressValue, setProgressValue] = useState(65);

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Shadcn Components Demo</h1>
                    <p className="text-muted-foreground">Test các component trong dark mode</p>
                </div>
                <ThemeToggle />
            </div>

            {/* Buttons Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Buttons</CardTitle>
                    <CardDescription>Các loại button khác nhau</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <Button variant="default">Default</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                        <Button size="icon">
                            <CheckCircle className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button disabled>Disabled</Button>
                        <Button variant="outline" disabled>
                            Disabled Outline
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Forms Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Form Elements</CardTitle>
                    <CardDescription>Input fields và form controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Enter your email" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="Enter password" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Type your message here..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="select">Select</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="option1">Option 1</SelectItem>
                                <SelectItem value="option2">Option 2</SelectItem>
                                <SelectItem value="option3">Option 3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="airplane-mode" checked={switchValue} onCheckedChange={setSwitchValue} />
                        <Label htmlFor="airplane-mode">Airplane Mode</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={checkboxValue}
                            onCheckedChange={(checked) => setCheckboxValue(checked === true)}
                        />
                        <Label htmlFor="terms">Accept terms and conditions</Label>
                    </div>
                </CardContent>
            </Card>

            {/* Alerts Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Alerts</CardTitle>
                    <CardDescription>Các loại thông báo khác nhau</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Info</AlertTitle>
                        <AlertDescription>This is an informational alert message.</AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>This is a destructive alert message.</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            {/* Badges Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Badges</CardTitle>
                    <CardDescription>Các loại badge khác nhau</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="default">Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Progress & Slider Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Progress & Slider</CardTitle>
                    <CardDescription>Progress bars và sliders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Progress: {progressValue}%</Label>
                        <Progress value={progressValue} className="w-full" />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => setProgressValue(Math.max(0, progressValue - 10))}>
                                -10
                            </Button>
                            <Button size="sm" onClick={() => setProgressValue(Math.min(100, progressValue + 10))}>
                                +10
                            </Button>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label>Slider: {sliderValue[0]}</Label>
                        <Slider
                            value={sliderValue}
                            onValueChange={setSliderValue}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Tabs Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Tabs</CardTitle>
                    <CardDescription>Tab navigation</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="tab1" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                        </TabsList>
                        <TabsContent value="tab1" className="space-y-2">
                            <h3 className="text-lg font-semibold">Tab 1 Content</h3>
                            <p className="text-muted-foreground">
                                This is the content of the first tab. It contains some text and demonstrates how the
                                content looks in the current theme.
                            </p>
                        </TabsContent>
                        <TabsContent value="tab2" className="space-y-2">
                            <h3 className="text-lg font-semibold">Tab 2 Content</h3>
                            <p className="text-muted-foreground">
                                This is the content of the second tab. Notice how the text and background colors adapt
                                to the theme.
                            </p>
                        </TabsContent>
                        <TabsContent value="tab3" className="space-y-2">
                            <h3 className="text-lg font-semibold">Tab 3 Content</h3>
                            <p className="text-muted-foreground">
                                This is the content of the third tab. All components should work well in both light and
                                dark modes.
                            </p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card description text</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            This is a card content. It should display properly in both light and dark themes.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">Action</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Another Card</CardTitle>
                        <CardDescription>With different content</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Feature 1</span>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Feature 2</span>
                                <XCircle className="h-4 w-4 text-red-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm">Total Users</span>
                                <Badge>1,234</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Active Today</span>
                                <Badge variant="secondary">89</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Errors</span>
                                <Badge variant="destructive">2</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ComponentsDemo;
