import MenuPageClient from "../../components/MenuPageClient.js";
import { fetchMenu } from "../../lib/serverApi.js";

export default async function MenuPage() {
  const { items, error } = await fetchMenu();

  return <MenuPageClient items={items} error={error} />;
}
