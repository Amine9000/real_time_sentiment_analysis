import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


export function FeedbackCarousel({className}) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className={className}
    >
      <CarouselContent className="w-100 h-[300px]">
        {Array.from({ length: 6 }).map((_, index) => {
          return (
          <CarouselItem key={index} className="w-100 h-100">
            <div className="w-100 h-[300px]">
              <Card className="w-100 h-[300px] border-none">
                <CardContent className="flex items-center justify-center p-0 w-100 h-[300px] border-none rounded-md overflow-hidden">
                  <img className="w-full h-auto" src={(index+1)+".jpg"} alt="" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        )})}
      </CarouselContent>
    </Carousel>
  )
}
