// App.tsx
import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";

type Tarea = {
  id: number;
  texto: string;
  completada: boolean;
};

export default function App() {
  const [tareas, setTareas] = useState<Tarea[]>([
    { id: 1, texto: "Testttt", completada: false },
    { id: 2, texto: "Aldiablo", completada: false },
    { id: 3, texto: "tareadefault", completada: true },
  ]);
  const [nuevaTarea, setNuevaTarea] = useState("");

  const agregarTarea = () => {
    const texto = nuevaTarea.trim();
    if (!texto) return;
    const tarea: Tarea = { id: Date.now(), texto, completada: false };
    setTareas((prev) => [...prev, tarea]);
    setNuevaTarea("");
  };

  const toggleTarea = (id: number) => {
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t))
    );
  };

  const eliminarTarea = (id: number) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));
  };

  const { tareasCompletadas, totalTareas } = useMemo(() => {
    const completadas = tareas.filter((t) => t.completada).length;
    return { tareasCompletadas: completadas, totalTareas: tareas.length };
  }, [tareas]);

  return (
    <View className="flex-1 bg-purple-50 p-6 pt-16">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-4xl font-bold text-gray-800 mb-1">Mis tareas</Text>
        <Text className="text-lg text-gray-600">
          {tareasCompletadas} de {totalTareas} completadas
        </Text>
      </View>

      {/* Input + Agregar */}
      <View className="flex-row items-center mb-6">
        <TextInput
          className="flex-1 bg-white px-4 py-3 rounded-xl border-2 border-purple-200 text-gray-800 mr-3"
          placeholder="Escribe una nueva tarea"
          value={nuevaTarea}
          onChangeText={setNuevaTarea}
          onSubmitEditing={agregarTarea}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={agregarTarea} className="bg-purple-600 px-4 py-3 rounded-xl">
          <Text className="text-white font-semibold">Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={tareas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-3 border border-purple-200">
            <TouchableOpacity
              onPress={() => toggleTarea(item.id)}
              className={`w-6 h-6 mr-3 rounded-full border-2 items-center justify-center ${
                item.completada ? "bg-purple-600 border-purple-600" : "border-gray-400"
              }`}
            >
              {item.completada ? <Text className="text-white text-sm">✓</Text> : null}
            </TouchableOpacity>

            <Text
              className={`flex-1 text-base ${
                item.completada ? "text-gray-400 line-through" : "text-gray-800"
              }`}
              numberOfLines={2}
            >
              {item.texto}
            </Text>

            <TouchableOpacity onPress={() => eliminarTarea(item.id)} className="ml-3 px-2 py-1">
              <Text className="text-red-600 text-lg">✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">No hay tareas aún, escribe una arriba.</Text>
        }
      />
    </View>
  );
}
