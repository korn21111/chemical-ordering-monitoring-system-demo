import { supabase } from "@/lib/supabase";

export default async function TestDbPage() {
    const { data, error } = await supabase
        .from("material_list_view")
        .select("*");

    return (
        <main style={{ padding: 24 }}>
            <h1>Material List View</h1>
            {error ? (
                <pre>{error.message}</pre>
            ) : (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            )}
        </main>
    );
}