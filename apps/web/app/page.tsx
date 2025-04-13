import Dashboard from "../components/dashboard";

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen w-full items-center justify-center'>
      <div className='container mx-auto py-10 max-w-5xl p-5'>
        <h1 className='font-bold text-2xl'>Dashboard</h1>
        <Dashboard />
      </div>
    </div>
  );
}
