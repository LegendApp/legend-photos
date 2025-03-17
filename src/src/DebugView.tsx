// biome-ignore lint/correctness/noUnusedImports: Some uses crash if importing React is missing
import * as React from "react";
import { memo, useEffect, useReducer } from "react";
import { Text, View } from "react-native";
import { getContentSize, use$, useStateContext } from "./state";
import type { InternalState } from "./types";

export const DebugView = memo(function DebugView({ state }: { state: InternalState }) {
    const ctx = useStateContext();
    const totalSize = use$<number>("totalSize");
    const contentSize = getContentSize(ctx);
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    useInterval(() => {
        forceUpdate();
    }, 100);

    return (
        <View
            style={{
                position: "absolute",
                top: 0,
                right: 0,
                paddingLeft: 4,
                paddingBottom: 4,
                // height: 100,
                backgroundColor: "#FFFFFFCC",
            }}
        >
            <Text>TotalSize: {totalSize}</Text>
            <Text>ContentSize: {contentSize}</Text>
            <Text>At end: {String(state.isAtBottom)}</Text>
        </View>
    );
});

function useInterval(callback: () => void, delay: number) {
    useEffect(() => {
        const interval = setInterval(callback, delay);
        return () => clearInterval(interval);
    }, [delay]);
}
