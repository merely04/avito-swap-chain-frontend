import { useMutation, useQueryClient } from '@tanstack/react-query'
import { chainKeys, respondToChain, type ChainDecision } from '@/entities/chain'
import { Button } from '@/shared/ui'

/** Ответ на предложение обмена: подтвердить участие или отклонить. */
export function RespondToExchange({ chainId }: { chainId: string }) {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (decision: ChainDecision) => respondToChain(chainId, decision),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chainKeys.all }),
  })

  return (
    <div className="flex flex-col gap-2.5">
      <Button fullWidth disabled={isPending} onClick={() => mutate('confirmed')}>
        Подтвердить участие
      </Button>
      <Button variant="secondary" fullWidth disabled={isPending} onClick={() => mutate('declined')}>
        Отклонить
      </Button>
    </div>
  )
}
