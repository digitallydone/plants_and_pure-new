// Path: app\admin\settings\page.jsx
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// export default function AdminSettingsPage() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="font-serif text-3xl font-bold">Settings</h1>
//         <p className="text-muted-foreground mt-1">Configure your store settings</p>
//       </div>

//       <div className="grid gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Store Information</CardTitle>
//             <CardDescription>Basic information about your store</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="storeName">Store Name</Label>
//                 <Input id="storeName" defaultValue="PLANTS and PURE" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="storeEmail">Contact Email</Label>
//                 <Input id="storeEmail" type="email" defaultValue="hello@plantsandpure.com" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="storeAddress">Store Address</Label>
//               <Input id="storeAddress" defaultValue="123 Green Lane, circle, Accra, Ghana" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Payment Settings</CardTitle>
//             <CardDescription>Configure your Paystack integration</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="paystackKey">Paystack Secret Key</Label>
//               <Input id="paystackKey" type="password" placeholder="sk_live_..." />
//               <p className="text-xs text-muted-foreground">
//                 Your Paystack secret key is stored securely as an environment variable
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Shipping Settings</CardTitle>
//             <CardDescription>Configure shipping options</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="shippingCost">Standard Shipping Cost (NGN)</Label>
//                 <Input id="shippingCost" type="number" defaultValue="2500" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (NGN)</Label>
//                 <Input id="freeShippingThreshold" type="number" defaultValue="50\
import React from "react";

const page = () => {
  return <div></div>;
};

export default page;
