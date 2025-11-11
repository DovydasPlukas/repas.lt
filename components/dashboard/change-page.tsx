"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Eye } from "lucide-react"

export default function ChangePage() {
  const [pageData, setPageData] = useState({
    title: "...",
    subtitle: "...",
    heroText: "...",
    footerText: "...",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Change Page</h2>
          <p className="text-muted-foreground mt-2">Edit your website content and appearance</p>
        </div>
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Homepage Settings</CardTitle>
            <CardDescription>Customize your homepage content and layout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="page-title">Page Title</Label>
              <Input
                id="page-title"
                value={pageData.title}
                onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                placeholder="Enter page title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page-subtitle">Subtitle</Label>
              <Input
                id="page-subtitle"
                value={pageData.subtitle}
                onChange={(e) => setPageData({ ...pageData, subtitle: e.target.value })}
                placeholder="Enter subtitle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-text">Hero Section Text</Label>
              <Textarea
                id="hero-text"
                value={pageData.heroText}
                onChange={(e) => setPageData({ ...pageData, heroText: e.target.value })}
                placeholder="Enter hero section text"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footer-text">Footer Text</Label>
              <Input
                id="footer-text"
                value={pageData.footerText}
                onChange={(e) => setPageData({ ...pageData, footerText: e.target.value })}
                placeholder="Enter footer text"
              />
            </div>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
