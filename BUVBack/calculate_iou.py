# -*- coding: utf-8 -*-
import numpy as np
import shapely
from shapely.geometry import Polygon, MultiPoint  # 多边形


def calculate_iou(linedata):

    # line1 = [2, 0, 2, 2, 0, 0, 0, 2]  # 四边形四个点坐标的一维数组表示，[x,y,x,y....]

    
    # a = np.array(linedata["line1"]).reshape(4, 2)  # 四边形二维坐标表示
    a = linedata["line1"]
    poly1 = Polygon(a).convex_hull  # python四边形对象，会自动计算四个点，最后四个点顺序为：左上 左下 右下 右上 左上
    # print(type(poly1))
    # print(Polygon(a).convex_hull)  # 可以打印看看是不是这样子

    # line2 = [1, 1, 4, 1, 4, 4, 1, 4]
    # b = np.array(linedata["line2"]).reshape(4, 2)
    b = linedata["line2"]
    poly2 = Polygon(b).convex_hull
    # print(poly2)
    # print(Polygon(b).convex_hull)

    union_poly = np.concatenate((a, b))  # 合并两个box坐标，变为8*2
    # print(union_poly)
    # print(MultiPoint(union_poly).convex_hull)  # 包含两四边形最小的多边形点
    if not poly1.intersects(poly2):  # 如果两四边形不相交
        iou = 0
    else:
        try:
            inter_area = poly1.intersection(poly2).area  # 相交面积
            # print(inter_area)
            # union_area = poly1.area + poly2.area - inter_area
            union_area = MultiPoint(union_poly).convex_hull.area
            # print(union_area)
            if union_area == 0:
                iou = 0
            # iou = float(inter_area) / (union_area-inter_area) #错了
            iou = float(inter_area) / union_area
            # iou=float(inter_area) /(poly1.area+poly2.area-inter_area)
            # 源码中给出了两种IOU计算方式，第一种计算的是: 交集部分/包含两个四边形最小多边形的面积
            # 第二种： 交集 / 并集（常见矩形框IOU计算方式）
        except shapely.geos.TopologicalError:
            print('shapely.geos.TopologicalError occured, iou set to 0')
            iou = 0
    #print(iou)
    #return [iou]
    # iou = "123"
    # iou = str(456)
    print(iou)
    return str(iou)

# if __name__ == '__main__':
#     res = calculate_iou()
#     print("res is",res, type(res))
# print(iou)
