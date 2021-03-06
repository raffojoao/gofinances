import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "styled-components";

import {
  Container,
  Header,
  UserInfo,
  Photo,
  UserGreeting,
  UserName,
  User,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadingContainer,
} from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expenses: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlighData] = useState<HighlightData>();
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const { signOut, user } = useAuth();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: "positive" | "negative"
  ) {
    const collectionFiltered = collection.filter(
      (transaction) => transaction.type === type
    );

    if (collectionFiltered.length === 0) return 0;

    const lastTransaction = Math.max.apply(
      Math,
      collectionFiltered.map((transaction) =>
        new Date(transaction.date).getTime()
      )
    );

    return Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(lastTransaction));
  }

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let totalEntries = 0;
    let totalExpenses = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        item.type === "positive"
          ? (totalEntries += Number(item.amount))
          : (totalExpenses += Number(item.amount));

        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      }
    );

    setTransactions(transactionsFormatted);

    const lastEntrie = getLastTransactionDate(transactions, "positive");
    const lastExpense = getLastTransactionDate(transactions, "negative");
    const totalInterval =
      lastExpense === 0 ? "N??o h?? transa????es" : `01 a ${lastExpense}`;

    setHighlighData({
      entries: {
        amount: totalEntries.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction:
          lastEntrie === 0
            ? "N??o h?? transa????es"
            : `??ltima entrada dia ${lastEntrie}`,
      },
      expenses: {
        amount: totalExpenses.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction:
          lastExpense === 0
            ? "N??o h?? transa????es"
            : `??ltima sa??da dia ${lastExpense}`,
      },
      total: {
        amount: (totalEntries - totalExpenses).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: totalInterval,
      },
    });
    setIsLoading(false);
  }

  async function clearTransactions() {
    await AsyncStorage.removeItem("@gofinances:transactions");
  }

  useEffect(() => {
    // clearTransactions();
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo,
                  }}
                />
                <User>
                  <UserGreeting>Ol??, </UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={highlightData!.entries.amount}
              lastTransaction={highlightData!.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Sa??das"
              amount={highlightData!.expenses.amount}
              lastTransaction={highlightData!.expenses.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={highlightData!.total.amount}
              lastTransaction={highlightData!.total.lastTransaction}
              type="total"
            />
          </HighlightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={transactions}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
