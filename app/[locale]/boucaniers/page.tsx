import { redirect } from 'next/navigation'

export default async function BoucaniersPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  redirect(`/${locale}/boucaniers/presentation`)
}
