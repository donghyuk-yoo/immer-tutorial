import React, { useRef, useCallback, useState } from "react";
import produce from "immer";

const App = () => {
  const nextId = useRef(1);
  const [form, setFrom] = useState({ name: "", username: "" });
  const [data, setData] = useState({
    array: [],
    uselessValue: null,
  });

  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setFrom(
      // ...연산자를 이용한 업데이트
      // {...form,
      // [name]: [value],}
      // immer 사용 업데이트, 불변성에 신경쓰지 않고 작성하되,
      // 실은 immer가 불변성을 유지하며 새로운 상태를 생성해 줌
      produce((draft) => {
        draft[name] = value;
      })
    );
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const info = {
        id: nextId.current,
        name: form.name,
        username: form.username,
      };

      setData(
        // {...data,
        // array: data.array.concat(info),}
        produce((draft) => {
          draft.array.push(info);
        })
      );

      setFrom({
        name: "",
        username: "",
      });
      nextId.current = nextId.current + 1;
    },
    [form.name, form.username]
  );

  const onRemove = useCallback((id) => {
    setData(
      // {
      //   ...data,
      //   array: data.array.filter((info) => info.id !== id),
      // }
      // 오히려 immer사용시 더 복잡해지는 경우도 있다. 이럴경우 굳이 사용할 필요x
      produce((draft) => {
        draft.array.splice(
          draft.array.findIndex((info) => info.id === id),
          1
        );
      })
    );
  }, []);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="username" placeholder="아이디" value={form.username} onChange={onChange} />
        <input name="name" placeholder="이름" value={form.name} onChange={onChange} />
        <button type="submit">등록</button>
      </form>
      <div>
        <ul>
          {data.array.map((info) => (
            <li key={info.id} onClick={() => onRemove(info.id)}>
              {info.username} ({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
