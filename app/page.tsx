import type { Metadata } from 'next'
import TrackThatApp from '../components/trackthatApp'

export const metadata: Metadata = {
  title: 'Track That App',
  description: 'Your personal finance tracker',
}

export default function Home() {
  return <TrackThatApp />
}