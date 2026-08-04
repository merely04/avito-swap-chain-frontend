import { Banner, Button, Card, Chip, Field, Input } from './shared/ui'

export default function App() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Цепочка обмена — UI-kit</h1>
        <p className="text-ink-2">shared/ui на токенах Avito (Tailwind v4)</p>
      </header>

      <section className="flex flex-wrap gap-3">
        <Button>Подтвердить участие</Button>
        <Button variant="dark">Найти</Button>
        <Button variant="secondary">Отклонить</Button>
        <Button variant="ghost">К моим вещам</Button>
        <Button variant="danger">Выйти из цепочки</Button>
      </section>

      <section className="flex flex-wrap gap-2">
        <Chip status="wait" dot>
          2 из 4
        </Chip>
        <Chip status="ok" dot>
          Подтверждено
        </Chip>
        <Chip status="frozen" dot>
          Reserved
        </Chip>
        <Chip status="brand" dot>
          Active
        </Chip>
        <Chip status="stop" dot>
          Распалась
        </Chip>
      </section>

      <Card padded className="flex flex-col gap-3">
        <Field label="Название">
          <Input defaultValue="Горный велосипед" />
        </Field>
        <Field label="Что хотите взамен">
          <Input placeholder="Игровая приставка или смартфон" />
        </Field>
      </Card>

      <Banner tone="ok">
        <span>
          <b className="font-bold">Все подтвердили.</b> Переходите к передаче.
        </span>
      </Banner>
    </main>
  )
}
