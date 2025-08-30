"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ExternalLink, Copy, Coins, Users, Calendar, Wallet } from "lucide-react"
import { MetaverseHeader } from "@/components/metaverse-header"
import { TokenStats } from "@/components/token-stats"
import { VirtualMerch } from "@/components/virtual-merch"
import { useToast } from "@/hooks/use-toast"
import type { MetaverseNFT, VirtualMerch as VirtualMerchType } from "@/types/wallet"

export default function MetaverseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [metaverse, setMetaverse] = useState<MetaverseNFT | null>(null)
  const [merch, setMerch] = useState<VirtualMerchType[]>([])
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const mvRes = await fetch("/data/metaverses.json")
        const mvJson = await mvRes.json()
        const found = (mvJson.metaverses || []).find((m: MetaverseNFT) => m.id === params?.id)
        setMetaverse(found || null)

        const merchRes = await fetch("/data/merch.json")
        const merchJson = await merchRes.json()
        const items = merchJson[params?.id as string] || []
        setMerch(items)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [params?.id])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1200)
      toast({ title: "Copied", description: "Address copied to clipboard." })
    } catch (e) {
      toast({ title: "Copy failed", description: "Could not copy to clipboard.", variant: "destructive" })
    }
  }

  if (!metaverse) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-10 text-center text-muted-foreground">
        Loading metaverse…
      </div>
    )
  }

  const baseScan = metaverse.tokenAddress ? `https://basescan.org/token/${metaverse.tokenAddress}` : null
  const tokenBuyUrl = (metaverse as any).tokenBuyUrl as string | undefined

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 space-y-6">
      <Button variant="ghost" className="px-0" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <MetaverseHeader metaverse={metaverse} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 md:w-[420px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="token">Token</TabsTrigger>
          <TabsTrigger value="merch">Merch</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About this Metaverse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{metaverse.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span className="font-medium">Organizer:</span> {metaverse.organizer}</div>
                <div><span className="font-medium">Creator:</span> {metaverse.creator || "—"}</div>
                <div><span className="font-medium">Launch date:</span> {metaverse.launchDate}</div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Token:</span>
                  {metaverse.tokenSymbol ? <Badge variant="outline">{metaverse.tokenSymbol}</Badge> : "TBA"}
                  {baseScan && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={baseScan} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" /> BaseScan
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="token">
          <TokenStats metaverse={metaverse} />
        </TabsContent>

        <TabsContent value="merch">
          <VirtualMerch merch={merch} tokenSymbol={metaverse.tokenSymbol || "TBA"} />
        </TabsContent>

        {tokenBuyUrl && (
          <div className="mt-4">
            <a href={tokenBuyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-muted">
              Buy Token
            </a>
          </div>
        )}
      </Tabs>
    </div>
  )
}
