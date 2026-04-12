import { getCitizensList, CitizenFilters } from "@/lib/services/citizen.service";
import CitizensManager from "./CitizensManager";

export async function CitizensListContainer({ filters }: { filters: CitizenFilters }) {
  const { citizens, totalPages, currentPage, totalCount } = await getCitizensList(filters);
  
  return (
    <CitizensManager 
      initialCitizens={citizens as any} 
      totalPages={totalPages} 
      currentPage={currentPage}
      totalCitizens={totalCount}
    />
  );
}
