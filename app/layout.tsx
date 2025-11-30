import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'StreamFlix - Watch Movies & TV Series Online',
    description: 'Stream unlimited movies and TV series in HD quality. Discover trending content, browse by genre, and enjoy premium entertainment.',
    keywords: 'movies, tv series, streaming, watch online, entertainment',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
