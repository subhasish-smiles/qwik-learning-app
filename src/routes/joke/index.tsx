import { $, component$, useSignal, useTask$ } from '@builder.io/qwik';
import {
  Form,
  routeAction$,
  routeLoader$,
  server$,
  z,
  zod$,
} from '@builder.io/qwik-city';
import { animate } from 'motion';

export const useDadJoke = routeLoader$(async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { accept: 'application/json' },
  });

  return (await response.json()) as {
    id: string;
    status: number;
    joke: string;
  };
});

export const useJokeAction = routeAction$(
  async (props) => {
    console.log('action props', props);
  },
  zod$({
    jokeID: z.string(),
  }),
);

export default component$(() => {
  const dadJokeSignal = useDadJoke();
  const checked = useSignal(false);
  const checked2 = useSignal(false);
  const jokeRef = useSignal<Element>();
  const jokeRef2 = useSignal<Element>();
  const favoriteJokeAction = useJokeAction();

  const animateColor = $((event) => {
    console.log('ello', event.target.checked);
    if (event.target.checked) {
      animate(jokeRef.value, { backgroundColor: 'red' });
    } else {
      animate(jokeRef.value, { backgroundColor: 'blue' });
    }
    checked.value = !checked.value;
  });

  const animateColor2 = $((event) => {
    console.log('ello2', event.target.checked);
    if (event.target.checked) {
      animate(jokeRef2.value, { x: '100vw', rotate: 45 });
    } else {
      animate(jokeRef2.value, { x: 0, rotate: 0 }, { duration: 0.5 });
    }
    checked2.value = !checked2.value;
  });

  useTask$(({ track }) => {
    track(() => checked.value);
    track(() => checked2.value);
    console.log('hiiiiiiii', checked.value, checked2.value);
    server$(() => {
      console.log('server here', checked.value, checked2.value);
    })();
  });

  return (
    <div class="">
      <div class="form-control w-52">
        <label class="cursor-pointer label">
          <span class="label-text">Remember me</span>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            checked={checked}
            onChange$={animateColor}
          />
        </label>
      </div>
      <div class="form-control w-52">
        <label class="cursor-pointer label">
          <span class="label-text">Remember me</span>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            checked={checked2}
            onChange$={animateColor2}
          />
        </label>
      </div>
      <section ref={jokeRef} class="text-teal-50 flex gap-4">
        {dadJokeSignal.value.joke}
        <Form action={favoriteJokeAction}>
          {/* <input type="hidden" name="jokeID" value={dadJokeSignal.value.joke} /> */}
          <input type="hidden" name="jokeID" value={Number(1234)} />
          <button class="btn" name="vote" value="up">
            up
          </button>
          <button class="btn" name="vote" value="down">
            down
          </button>
        </Form>
      </section>
      <section
        ref={jokeRef2}
        class="text-blue-700 flex gap-4 bg-yellow-100 rounded-full p-4 w-32"
      >
        abcde
      </section>
    </div>
  );
});
