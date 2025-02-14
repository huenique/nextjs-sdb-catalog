import {
  AppShell,
  Aside,
  Badge,
  Box,
  Burger,
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  Flex,
  Group,
  Header,
  Image,
  MediaQuery,
  NavLink,
  Navbar,
  Paper,
  Text,
  TextInput,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconCategory,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons";
import React from "react";

const useStyles = createStyles((theme) => ({
  card: {
    height: "auto",
    width: "20rem",

    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,

    [theme.fn.smallerThan("xl")]: {
      height: "100%",
      width: "100%",
    },
  },

  imageSection: {
    padding: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  productName: {
    marginBottom: theme.spacing.xs,
    lineHeight: 1,
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    letterSpacing: -0.25,
    textTransform: "uppercase",
  },

  section: {
    padding: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  icon: {
    marginRight: 5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[5],
  },
  responsiveText: {
    fontSize: theme.fontSizes.md,

    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.sm,
    },
  },
}));

const mockdata = [
  {
    name: "Decorus",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 1000,
    label: ["Label 1", "Label 2", "Label 3"],
  },
  {
    name: "Eager",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 2000,
    label: ["Label 1", "Label 2"],
  },
  {
    name: "Poppy Petals",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 3000,
    label: ["Label 1", "Label 2"],
  },
  {
    name: "Electric Zap",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 4000,
    label: ["Label 1", "Label 2"],
  },
];

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

interface RowData {
  name: string;
  description: string;
  price: number;
  label: string[];
}

interface TableSortProps {
  data: RowData[];
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) => item.name.toLowerCase().includes(query));
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(data, payload.search).sort((a, b) => {
    if (a[sortBy] > b[sortBy]) {
      return payload.reversed ? -1 : 1;
    }

    if (a[sortBy] < b[sortBy]) {
      return payload.reversed ? 1 : -1;
    }

    return 0;
  });
}

function MenuItem({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;

  return (
    <UnstyledButton onClick={onSort}>
      <Flex align="center" gap={2}>
        <Text size="sm">{children}</Text>
        <Center>
          <Icon size={14} stroke={1.5} />
        </Center>
      </Flex>
    </UnstyledButton>
  );
}

export default function Catalog() {
  const { classes } = useStyles();
  const [search, setSearch] = React.useState("");
  const [sortedData, setSortedData] = React.useState(mockdata);
  const [sortBy, setSortBy] = React.useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = React.useState(false);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(mockdata, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(mockdata, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  const products = sortedData.map((product, idx) => (
    <Card withBorder m="sm" radius="md" className={classes.card} key={idx}>
      <Card.Section className={classes.imageSection}>
        <Image src="https://i.imgur.com/ZL52Q2D.png" alt={product.name} />
      </Card.Section>
      <Group position="apart" mt="md">
        <div>
          <Text weight={500}>{product.name}</Text>
          <Text size="xs" color="dimmed">
            {product.description}
          </Text>
        </div>
        <Badge variant="outline" color="green">
          25% off
        </Badge>
      </Group>
      <Card.Section className={classes.section} mt="md">
        <Text size="sm" color="dimmed" className={classes.productName}>
          Label
        </Text>

        <Group spacing={8} mb={-8}>
          {product.label.map((label) => (
            <Center key={label}>
              <Text size="xs">{label}</Text>
            </Center>
          ))}
        </Group>
      </Card.Section>
      <Card.Section className={classes.section}>
        <Box mt="sm" mb="sm">
          <Group position="apart">
            <Text size="xl" weight={700} sx={{ lineHeight: 1 }}>
              ₱{product.price}
            </Text>
            <Button radius="lg" w="50%">
              Add to cart
            </Button>
          </Group>
        </Box>
      </Card.Section>
    </Card>
  ));

  return (
    <Container size="lg">
      <Paper w="auto" shadow="xs" p="md">
        <Flex justify="flex-start" gap="md">
          <TextInput
            placeholder="Search by item name"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
          <MenuItem
            reversed={reverseSortDirection}
            sorted={sortBy === "price"}
            onSort={() => setSorting("price")}
          >
            Price
          </MenuItem>
        </Flex>
      </Paper>
      <Flex align="center" justify="space" wrap="wrap" mt="md" mb="md">
        {products.length > 0 ? products : <Text>Nothing found</Text>}
      </Flex>
    </Container>
  );
}
