import { useEffect, useState } from "react";

const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    if (!isMounted) setIsMounted(true);
  }, [isMounted]);
  return isMounted;
};

export default useIsMounted;
