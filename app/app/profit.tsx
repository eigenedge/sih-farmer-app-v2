// app/profit.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { db } from "./firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ProfitPage() {
  const [area, setArea] = useState("");
  const [yieldPerAcre, setYieldPerAcre] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [cost, setCost] = useState("");
  const [result, setResult] = useState<{
    revenue: number;
    profit: number;
    margin: number;
    status: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const parse = (v: string) => {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  };

  const calculate = () => {
    const a = parse(area);
    const y = parse(yieldPerAcre);
    const p = parse(pricePerKg);
    const c = parse(cost);

    const revenue = a * y * p;
    const profit = revenue - c;
    const margin = revenue === 0 ? 0 : (profit / revenue) * 100;

    let status = "Break-even";
    if (profit > 0) status = "Profitable";
    if (profit < 0) status = "Loss";

    setResult({ revenue, profit, margin, status });
  };

  const save = async () => {
    if (!result) {
      Alert.alert("Calculate first", "Please calculate profit before saving.");
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "profits"), {
        area: parse(area),
        yieldPerAcre: parse(yieldPerAcre),
        pricePerKg: parse(pricePerKg),
        cost: parse(cost),
        revenue: result.revenue,
        profit: result.profit,
        margin: result.margin,
        status: result.status,
        createdAt: serverTimestamp(),
      });
      Alert.alert("Saved", "Entry saved to Firestore.");
    } catch (err) {
      console.error("Save error", err);
      Alert.alert("Error", "Could not save to Firestore.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profit Identification</Text>

      <TextInput
        style={styles.input}
        placeholder="Farm area (acres)"
        keyboardType="numeric"
        value={area}
        onChangeText={setArea}
      />
      <TextInput
        style={styles.input}
        placeholder="Expected yield (kg per acre)"
        keyboardType="numeric"
        value={yieldPerAcre}
        onChangeText={setYieldPerAcre}
      />
      <TextInput
        style={styles.input}
        placeholder="Market price (₹ per kg)"
        keyboardType="numeric"
        value={pricePerKg}
        onChangeText={setPricePerKg}
      />
      <TextInput
        style={styles.input}
        placeholder="Total cost (₹)"
        keyboardType="numeric"
        value={cost}
        onChangeText={setCost}
      />

      <Button title="Calculate Profit" onPress={calculate} />

      {result && (
        <View style={styles.resultBox}>
          <Text>Revenue: ₹{result.revenue.toFixed(2)}</Text>
          <Text>Profit: ₹{result.profit.toFixed(2)}</Text>
          <Text>Margin: {result.margin.toFixed(2)}%</Text>
          <Text>Status: {result.status}</Text>

          <View style={{ marginTop: 12 }}>
            <Button
              title={saving ? "Saving..." : "Save to Cloud"}
              onPress={save}
              disabled={saving}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  resultBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f6f6f8",
    borderRadius: 10,
  },
});
