import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { getSectorRoleLabel } from "@/data/sectorModules";

/**
 * Hook providing dynamic role labels based on the current demo sector.
 * e.g. "Client" → "Élève" for auto-école, "Salarié" → "Moniteur", etc.
 */
export function useSectorRoleLabels() {
  const { demoSector } = useDemoPlan();

  const clientLabel = getSectorRoleLabel(demoSector, "client") || "Client";
  const employeeLabel = getSectorRoleLabel(demoSector, "employee") || "Salarié";
  const adminLabel = getSectorRoleLabel(demoSector, "admin") || "Admin";

  // Simple French plural: add "s" if not already ending with "s"
  const pluralize = (label: string) => label.endsWith("s") ? label : label + "s";

  return {
    clientLabel,
    employeeLabel,
    adminLabel,
    clientsLabel: pluralize(clientLabel),
    employeesLabel: pluralize(employeeLabel),
  };
}
