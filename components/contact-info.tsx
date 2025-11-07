import type React from "react"
interface ContactInfoProps {
  icon: React.ReactNode
  title: string
  content: string
  link?: string
}

export function ContactInfo({ icon, title, content, link }: ContactInfoProps) {
  const contentElement = content.split('\n').map((line, index) => (
    <p key={index} className="text-muted-foreground leading-relaxed">{line}</p>
  ));

  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="mb-1 font-semibold">{title}</h3>
        {link ? (
          <a href={link} className="text-muted-foreground leading-relaxed transition-colors hover:text-foreground">
            {content}
          </a>
        ) : (
          contentElement
        )}
      </div>
    </div>
  )
}