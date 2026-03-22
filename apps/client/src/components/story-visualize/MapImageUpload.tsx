"use client"

import { useState, useRef, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, Upload, X, Map as MapIcon, SlidersHorizontal } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

interface Props {
    onImageUpload: (url: string | null) => void
    currentImageUrl: string | null
    opacity: number
    onOpacityChange: (value: number) => void
    uiOpacity: number
    onUiOpacityChange: (value: number) => void
    blur: number
    onBlurChange: (value: number) => void
}

export function MapImageUpload({
    onImageUpload,
    currentImageUrl,
    opacity,
    onOpacityChange,
    uiOpacity,
    onUiOpacityChange,
    blur,
    onBlurChange
}: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const formData = new FormData()
            formData.append('map', file)
            
            try {
                const res = await fetch('/api/map', {
                    method: 'POST',
                    body: formData
                })
                const data = await res.json()
                if (data.success) {
                    // Cache bust with timestamp
                    onImageUpload(`/api/map?t=${Date.now()}`)
                }
            } catch (err) {
                console.error('Failed to upload map:', err)
                // Fallback to local URL if upload fails (optional)
                const url = URL.createObjectURL(file)
                onImageUpload(url)
            }
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon-sm" className="rounded-full shadow-sm hover:scale-105 transition-all">
                    {currentImageUrl ? (
                        <MapIcon className="size-3 text-primary" />
                    ) : (
                        <ImageIcon className="size-3 text-muted-foreground/50" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 bg-background/95 backdrop-blur-xl border-primary/10 shadow-2xl">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60">Interface & Map Settings</h3>
                        {currentImageUrl && (
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={async () => {
                                    try {
                                        await fetch('/api/map', { method: 'DELETE' })
                                        onImageUpload(null)
                                    } catch (e) {
                                        console.error('Failed to delete map', e)
                                    }
                                }}
                                className="hover:text-destructive"
                            >
                                <X className="size-3" />
                            </Button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">UI Opacity</span>
                                <span className="text-[9px] font-bold font-mono">{Math.round(uiOpacity * 100)}%</span>
                            </div>
                            <Slider
                                value={[uiOpacity * 100]}
                                onValueChange={(v) => onUiOpacityChange(v[0] / 100)}
                                max={100}
                                step={1}
                                className="py-1"
                            />
                        </div>

                        {!currentImageUrl ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-primary/20 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all group"
                            >
                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Upload className="size-4 text-primary" />
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground">Upload Map Image</span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-primary/10 shadow-inner group">
                                    <img src={currentImageUrl} alt="Map Background" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="h-7 text-[9px] font-bold uppercase tracking-tight"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            Replace
                                        </Button>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">Map Opacity</span>
                                            <span className="text-[9px] font-bold font-mono">{Math.round(opacity * 100)}%</span>
                                        </div>
                                        <Slider
                                            value={[opacity * 100]}
                                            onValueChange={(v) => onOpacityChange(v[0] / 100)}
                                            max={100}
                                            step={1}
                                            className="py-1"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">Residue Blur</span>
                                            <span className="text-[9px] font-bold font-mono">{blur}px</span>
                                        </div>
                                        <Slider
                                            value={[blur]}
                                            onValueChange={(v) => onBlurChange(v[0])}
                                            max={20}
                                            step={1}
                                            className="py-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-2 border-t border-primary/5">
                        <p className="text-[8px] italic text-muted-foreground/60 leading-tight">
                            Uploaded images are kept locally in your browser for this session.
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
