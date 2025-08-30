"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { VirtualMerch } from "@/components/virtual-merch"
import type { VirtualMerch as VirtualMerchType, MetaverseNFT } from "@/types/wallet"

export default function MerchPage() {
  const params = useParams()
  const [items, setItems] = useState<VirtualMerchType[]>([])
  const [mv, setMv] = useState<MetaverseNFT | null>(null)

  useEffect(() => {
    const load = async () => {
      const mvRes = await fetch("/data/metaverses.json")
      const mvJson = await mvRes.json()
      const found = (mvJson.metaverses || []).find((m: MetaverseNFT) => m.id === params?.id)
      setMv(found || null)

      const res = await fetch("/data/merch.json")
      const json = await res.json()
      setItems(json[params?.id as string] || [])
    }
    load()
  }, [params?.id])

  if (!mv) return <div className="container mx-auto px-4 py-10 text-center text-muted-foreground">Loading…</div>

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Merch – {mv.name}</CardTitle>
        </CardHeader>
      </Card>
      <VirtualMerch merch={items} tokenSymbol={mv.tokenSymbol || "TBA"} />
    </div>
  )
}
