import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="font-heading text-4xl font-bold text-primary mb-2 text-center">Frequently Asked Questions</h1>
      <p className="text-muted-foreground text-center mb-12">Everything you need to know about our products and how we operate.</p>

      <Accordion className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-medium hover:text-primary">How do I place an order?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Since our pieces are highly unique and handcrafted, all orders are placed directly through WhatsApp. Simply browse our website, find the items you love, and send us a message with the product image or name to complete your purchase.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg font-medium hover:text-primary">Do you offer returns or exchanges?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            No, we do not offer returns or exchanges. Because we deal in premium, authentic Kutchi handmade items and operate locally, all sales are final. Please review the images and ask any questions on WhatsApp before buying.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg font-medium hover:text-primary">Will the product look exactly like the image?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Yes, absolutely. The exact image you see on our website or the one we share on WhatsApp is the exact original product you will receive. We guarantee 100% authenticity.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg font-medium hover:text-primary">Where do you deliver?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            We currently sell and deliver locally. Please contact us on WhatsApp to discuss delivery arrangements for your location.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
