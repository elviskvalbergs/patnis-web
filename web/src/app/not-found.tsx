import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container-x py-24 text-center">
      <h1 className="font-serif text-4xl">Lapa nav atrasta</h1>
      <Link href="/" className="btn-primary mt-6">Uz sākumu</Link>
    </main>
  )
}
