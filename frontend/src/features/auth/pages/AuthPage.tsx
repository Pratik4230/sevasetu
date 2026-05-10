import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";

export function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.2),_transparent_40%),linear-gradient(to_bottom,_#f5fff9,_#ecfdf5)] p-4">
      <Card className="w-full max-w-md border-emerald-200 bg-white/90 shadow-xl backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-emerald-900">Welcome to SevaSetu</CardTitle>
          <CardDescription>
            Premium local services marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <Tabs defaultValue="customer" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="customer">As Customer</TabsTrigger>
                  <TabsTrigger value="provider">As Provider</TabsTrigger>
                </TabsList>
                <TabsContent value="customer">
                  <RegisterForm defaultRole="customer" />
                </TabsContent>
                <TabsContent value="provider">
                  <RegisterForm defaultRole="provider" />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
