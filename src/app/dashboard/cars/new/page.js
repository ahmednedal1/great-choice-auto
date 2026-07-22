import CarForm from "@/components/CarForm";

export default function NewCarPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl">Add Car</h1>
      <div className="swoosh-divider w-16 mt-2 mb-8" />
      <CarForm />
    </div>
  );
}
