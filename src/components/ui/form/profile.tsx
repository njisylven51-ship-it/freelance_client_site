import { Button } from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Comming soon</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">set profile</h4>
            <p className="text-muted-foreground text-sm">
             Profile info
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
export default PopoverDemo;