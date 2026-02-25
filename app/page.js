// Root page — redirect to the creator page
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/creator.html');
}
