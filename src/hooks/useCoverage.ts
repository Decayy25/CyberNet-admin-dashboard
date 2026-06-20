import { useMutation } from "@tanstack/react-query";
import LocationService from "@/services/location.service";

const useCoverage = () => {
  return useMutation({
    mutationFn: LocationService.predictLocation,
  });
};

export default useCoverage;