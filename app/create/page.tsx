"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function CreateMetaversePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const data = Object.fromEntries(new FormData(form).entries()) as any
    // Build a pending object
    const pending = {
      id: "pending-" + Math.random().toString(36).slice(2,8),
      name: data.eventName as string,
      description: data.description as string,
      image: (data.imageUrl as string) || "/placeholder.jpg",
      organizer: (data.organizerName as string) || "Unknown",
      organizerWallet: data.organizerWallet as string,
      launchDate: new Date().toISOString().slice(0,10),
      tokenName: `${data.eventName} by MetaBuild HUB`,
      tokenSymbol: (data.tokenSymbol as string) || "TBA",
      status: "pending"
    }

    try {
      const raw = window.localStorage.getItem("metabuild_pending_metaverses")
      const arr = raw ? JSON.parse(raw) : []
      arr.unshift(pending)
      window.localStorage.setItem("metabuild_pending_metaverses", JSON.stringify(arr))
      toast({ title: "Submitted", description: "Your metaverse request was recorded and is pending approval." })
      router.push("/")
    } catch (e) {
      console.error(e)
      toast({ title: "Error", description: "Could not save your request locally.", variant: "destructive" })
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Launch a new Metaverse (Request)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizerName">Organizer / Entity</Label>
                <Input id="organizerName" name="organizerName" placeholder="Aleph, FinteChile, ..." required />
              </div>
              <div>
                <Label htmlFor="organizerWallet">Organizer Wallet (EVM)</Label>
                <Input id="organizerWallet" name="organizerWallet" placeholder="0x…" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventName">Metaverse / Event Name</Label>
                <Input id="eventName" name="eventName" placeholder="Aleph Hub" required />
              </div>
              <div>
                <Label htmlFor="tokenSymbol">Preferred Token Symbol (optional)</Label>
                <Input id="tokenSymbol" name="tokenSymbol" placeholder="ALEPHHUB" />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Short description…" required />
            </div>

            <div>
              <Label htmlFor="imageUrl">Image URL (cover)</Label>
              <Input id="imageUrl" name="imageUrl" placeholder="/placeholder.jpg or https://…" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting…" : "Submit Request"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            *For the hackathon demo, requests are stored locally in your browser and shown as “Pending” on the marketplace.
            The approved flow (NFT mint + token deployment on Base) can be wired to a smart-contract factory after the event.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
