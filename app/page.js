// Root page — redirect to the static index.html
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/index.html');
}
